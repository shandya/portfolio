import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const portfolioDbId = process.env.NOTION_PORTFOLIO_DB_ID;
const workDbId = process.env.NOTION_WORK_DB_ID;

/**
 * Fetch all portfolio projects from Notion database.
 * Maps Notion properties to the same shape as the old portfolio.json.
 */
export async function getPortfolioData() {
  const response = await notion.databases.query({
    database_id: portfolioDbId,
    sorts: [
      {
        property: 'Year',
        direction: 'descending',
      },
    ],
  });

  return response.results.map((page) => {
    const props = page.properties;

    return {
      name: props.Name?.title?.[0]?.plain_text ?? '',
      tags: props.Tags?.rich_text?.[0]?.plain_text ?? '',
      year: props.Year?.rich_text?.[0]?.plain_text ?? '',
      highlight: props.Highlight?.checkbox ?? false,
      client: props.Client?.rich_text?.[0]?.plain_text ?? '',
      made_at: props.MadeAt?.rich_text?.[0]?.plain_text ?? '',
      external_url: props.ExternalUrl?.url ?? '',
      description: props.Description?.rich_text?.[0]?.plain_text ?? '',
    };
  });
}

/**
 * Fetch all work experience entries from Notion database.
 * Maps Notion properties to the same shape as the old work.json.
 */
export async function getWorkData() {
  const response = await notion.databases.query({
    database_id: workDbId,
    sorts: [
      {
        property: 'Order',
        direction: 'ascending',
      },
    ],
  });

  return response.results.map((page) => {
    const props = page.properties;

    return {
      title: props.Name?.title?.[0]?.plain_text ?? '',
      company_name: props.Company?.rich_text?.[0]?.plain_text ?? '',
      time: props.Time?.rich_text?.[0]?.plain_text ?? '',
      location: props.Location?.rich_text?.[0]?.plain_text ?? '',
      job_desc: props.JobDesc?.rich_text?.[0]?.plain_text ?? '',
    };
  });
}
