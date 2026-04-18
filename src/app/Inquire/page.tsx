import InquiryForm from './InquiryForm';
import NavbarSimple from '../components/NavbarSimple';

export default function InquirePage() {
  return (
    <>
      <NavbarSimple />
      <main className="min-h-screen bg-gray-100 px-4 pt-[200px] py-10 sm:pt-[120px]">
        <div className="mx-auto max-w-5xl">
          <InquiryForm />
        </div>
      </main>
    </>
  );
}