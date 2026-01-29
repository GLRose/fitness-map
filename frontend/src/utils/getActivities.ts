import type { DateItem } from '@/components/grid/Grid';

export async function getActivities(): Promise<DateItem[]> {
  const url = 'http://localhost:3000/api/activities';
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return [];
  }
}
