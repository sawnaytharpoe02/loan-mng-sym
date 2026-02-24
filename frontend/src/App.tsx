import { BorrowerList } from "./features/borrower/components/BorrowerList";

export function App() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto py-8">
                <BorrowerList />
            </div>
        </main>
    )
}

export default App;