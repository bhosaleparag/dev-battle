import Image from 'next/image';
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-2">
      <Image src={`/not-found.png`} alt='dev battle logo' width="750" height="400"/>
      <p className="my-6 ">
        Could not find the requested resource.
      </p>
      <Link href="/" className="px-4 py-2 rounded-md font-medium transition-colors bg-transparent text-white border border-gray-15 hover:bg-gray-15/20">
        Return Home
      </Link>
    </div>
  );
}
