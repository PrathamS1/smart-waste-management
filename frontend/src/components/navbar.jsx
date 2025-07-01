import { Link } from "react-router-dom";

function Navbar () {
    return(
        <>
            <div className="navbar-container w-full h-fit pt-4 pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 shadow-lg">
                <div className="navbar-header flex items-center justify-center flex-col">
                    <h1 className="text-5xl font-bold font-[Poppins]">SWCS Simulator</h1>
                    <h2 className="text-2xl font-medium font-[Lora]">A Smart Waste Collection System Simulator</h2>
                    <div className="flex gap-8 mt-4">
                        <Link to="/" className="text-lg font-semibold text-white hover:text-indigo-200 transition-colors">Home</Link>
                        <Link to="/how-it-works" className="text-lg font-semibold text-white hover:text-indigo-200 transition-colors">How It Works</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Navbar;