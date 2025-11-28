import Todo from "./Todo/Todo";


export default function Home() {
  return (
    <div className="min-h-screen bg-black dark:bg-black font-sans">
      <main className="py-12">
        <Todo />
      </main>
    </div>
  );
}
