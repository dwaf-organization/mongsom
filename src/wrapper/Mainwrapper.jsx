export default function Mainwrapper({ children }) {
  return (
    <main>
        <div className="container mx-auto py-20">
            {children}
        </div>
    </main>
  );
}