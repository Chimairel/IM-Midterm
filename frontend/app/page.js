import { redirect } from 'next/navigation';

export default function Home() {
    // This immediately redirects any visitor hitting the root URL (/) to /login
    redirect('/login'); 

    // The function must return something, even though the redirect will happen first.
    return null; 
}