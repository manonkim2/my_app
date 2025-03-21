'use client'

import { useActionState, useEffect, useState, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { format, isSameDay } from 'date-fns'

import { useTaskContext } from '../context'
import {
  completeRoutine,
  createRoutine,
  deleteRoutine,
  getRoutineLog,
  IRoutine,
  unCompleteRoutine,
} from '../actions/routineActions'
import FormActionWrapper from '@/components/FormActionWrapper'
import Box from '@/components/Box'

import { getDateWithWeek } from '@/utils/formmattedDate'
import { cn } from '@/utils/cn'
import DropDown from '@/app/(main)/schedule/components/DropDown'
import { Button } from '@/components/ui'

const RoutineManager = ({ routineList }: { routineList: IRoutine[] }) => {
  const { date, week } = useTaskContext()

  const [routines, setRoutines] = useState<IRoutine[]>(routineList)
  const [completedDay, setCompletedDay] = useState<Record<string, Set<number>>>(
    {},
  )

  const updateCompletionState = (id: number, isCompleted: boolean) => {
    setCompletedDay((prev) => {
      const dateKey = format(date, 'yyyy-MM-dd')
      const updatedSet = new Set(prev[dateKey] || [])

      if (isCompleted) {
        updatedSet.add(id)
      } else {
        updatedSet.delete(id)
      }

      return { ...prev, [dateKey]: updatedSet }
    })
  }

  const [, formAction, isPending] = useActionState(
    async (_: void | null, formData: FormData) => {
      const newRoutine = await createRoutine(formData)

      if (newRoutine) {
        setRoutines((prev) => [...prev, newRoutine])
      }
    },
    null,
  )

  const handleClickComplete = async (id: number) => {
    const completedLog = await completeRoutine(id, date)

    if (completedLog) {
      setRoutines((prev) =>
        prev.map((routine) =>
          routine.id === id ? { ...routine, logId: completedLog.id } : routine,
        ),
      )
      updateCompletionState(id, true)
    }
  }

  const handleClickUndo = async (id: number | undefined) => {
    if (!id) return

    setRoutines((prev) =>
      prev.map((routine) =>
        routine.logId === id ? { ...routine, logId: undefined } : routine,
      ),
    )
    updateCompletionState(id, false)

    await unCompleteRoutine(id)

    fetchRoutineLogs()
  }

  const handleOnClickDelete = async (id: number) => {
    if (!id) return

    await deleteRoutine(id)
    setRoutines((prev) => prev.filter((routine) => routine.id !== id))
  }

  const getCompletionPercent = (routineId: number) => {
    const completedCount = week.filter((day) => {
      const dateKey = format(day, 'yyyy-MM-dd')
      return completedDay[dateKey]?.has(routineId)
    }).length

    return (completedCount / 7) * 100
  }

  const fetchRoutineLogs = useCallback(
    async (updateFromUndo = false) => {
      const logs = await getRoutineLog(undefined, week)
      const logMap = logs.reduce<Record<string, Set<number>>>((acc, log) => {
        const dateKey = format(new Date(log.date), 'yyyy-MM-dd')
        acc[dateKey] = acc[dateKey] || new Set()
        acc[dateKey].add(log.routineId)
        return acc
      }, {})

      if (!updateFromUndo) {
        setCompletedDay(logMap)
      }

      setRoutines((prev) =>
        prev.map((routine) => {
          const log = logs.find(
            (log) =>
              isSameDay(new Date(log.date), date) &&
              log.routineId === routine.id,
          )
          return {
            ...routine,
            logId: log?.id,
          }
        }),
      )
    },
    [date, week, setRoutines],
  )

  useEffect(() => {
    fetchRoutineLogs()
  }, [fetchRoutineLogs])

  return (
    <Box
      title={
        <div className="flex flex-col xl:flex-row justify-between items-baseline px-sm pt-sm">
          <h1 className="text-fontPrimary text-2xl">Routines</h1>
          <span className="text-fontPrimary text-md">
            {getDateWithWeek(date)}
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-sm pb-sm">
        <FormActionWrapper
          formAction={formAction}
          placeholder="Add your routine"
          isPending={isPending}
        />
        {routines?.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onClickComplete={handleClickComplete}
            onClickUndo={handleClickUndo}
            onClickDelete={handleOnClickDelete}
            completedDay={completedDay}
            week={week}
            percent={getCompletionPercent(routine.id)}
          />
        ))}
      </div>
    </Box>
  )
}

const RoutineCard = ({
  routine,
  onClickComplete,
  onClickUndo,
  onClickDelete,
  completedDay,
  week,
  percent,
}: {
  routine: IRoutine
  onClickComplete: (id: number) => void
  onClickUndo: (id: number | undefined) => void
  onClickDelete: (id: number) => void
  completedDay: Record<string, Set<number>>
  week: Date[]

  percent: number
}) => {
  const controls = useAnimation()

  useEffect(() => {
    const radius = Math.min(percent * 1.2)

    controls.start({
      clipPath: `circle(${radius}% at 35px 25%)`,
      transition: { duration: 1, ease: 'easeInOut' },
    })
  }, [percent, controls])

  const renderWeek = () => {
    const today = format(new Date(), 'yyyy-MM-dd')

    return (
      <div className="flex justify-between">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
          const dateKey = format(week[index], 'yyyy-MM-dd')
          const isCompleted = completedDay[dateKey]?.has(routine.id)
          const isToday = dateKey === today

          return (
            <span
              key={index}
              className={cn(
                'text-xs relative flex items-center justify-center',
                isCompleted
                  ? 'font-bold text-black'
                  : 'text-gray-300 font-light',
              )}
            >
              {day}
              {isToday && (
                <span
                  className="absolute"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '1px solid black',
                  }}
                />
              )}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col justify-between relative border gap-sm rounded-lg h-[100px] min-w-[160px] p-lg overflow-hidden ',
      )}
    >
      <motion.div
        initial={{ clipPath: 'circle(0% at 0% 0%)' }}
        animate={controls}
        className="absolute left-0 top-0 h-full w-full bg-black opacity-10 pointer-events-none"
      ></motion.div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">{routine.name}</span>
        <DropDown
          disabled={Boolean(!routine.logId)}
          onClickUndo={() => onClickUndo(routine.logId)}
          onClickDelete={() => onClickDelete(routine.id)}
        />
      </div>

      {!routine.logId ? (
        <Button
          onClick={() => onClickComplete(routine.id)}
          size="sm"
          className="z-1000"
        >
          Complete
        </Button>
      ) : (
        <>{renderWeek()}</>
      )}
    </div>
  )
}

export default RoutineManager
