import React from 'react';
import { Metadata } from 'next';
import { getSchoolPageData } from '@/lib/queries/school';
import { SchoolPageComponent } from '@/components/school/SchoolPageComponent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'School Sports & Physical Education Programs | Growing Fit',
  description:
    'Comprehensive on-campus sports, martial arts, and physical education programs for educational institutions. Certified coaches, structured curriculum, and holistic student development.',
};

export default async function SchoolAliasPage() {
  const data = await getSchoolPageData();
  return <SchoolPageComponent data={data} />;
}
