import { redirect } from 'next/navigation';

export default function AdminHeaderRedirect() {
  redirect('/admin');
}
