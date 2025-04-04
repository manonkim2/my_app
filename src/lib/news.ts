import { NewsCardItem, RssFeed } from '@/types/rss'
import Parser from 'rss-parser'

export const fetchDashboardNews = async () => {
  const parser = new Parser({
    customFields: {
      item: ['media:content', 'no'],
    },
  })

  const news = (await parser.parseURL(
    'https://www.mk.co.kr/rss/30000001/',
  )) as RssFeed

  const newsCardItems: NewsCardItem[] = news.items
    .map((item) => ({
      no: item.no,
      title: item.title,
      content: item.content,
      contentSnippet: item.contentSnippet,
      pubDate: item.pubDate,
      link: item.link,
      enclosureUrl: item['media:content']?.$?.url,
    }))
    .filter((item) => item.enclosureUrl)
    .slice(0, 10)

  return newsCardItems
}
