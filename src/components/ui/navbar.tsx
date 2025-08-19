import { type Page } from '../../App'

interface NavbarProps {
    currentPage: Page
    onNavigate: (page: Page) => void
}

interface NavItemProps {
    text: string
    page: Page
}

const NavItems:NavItemProps[] = [
    {text: "calendar", page: "calendar"},
    {text: "tasks", page: "list"},
    {text: "add task", page: "create"},
]

export const Navbar = ({ currentPage, onNavigate}: NavbarProps) => {
    return(
        <nav className="absolute top-0 left-0 right-0 mx-auto w-md h-18 px-2 shadow-md backdrop-blur-md
                        rounded-b-2xl bg-gradient-to-b from-cyan-400/60 to-white/30">
            <div className="py-4">
                <ul className="flex flex-row items-center justify-evenly">
                    {NavItems.map((item, key) => (
                        <li key={key}>
                            <button
                                onClick={() => onNavigate(item.page)}
                                className={`p-2 mx-3 text-2xl rounded-xl transition-all duration-200 text-shadow-md
                                            ${currentPage === item.page 
                                                ? 'bg-transparent text-indigo-500 shadow-md'
                                                : 'text-indigo-900 hover:bg-white/10 hover:text-indigo-400 cursor-pointer'}`}
                            >
                                {item.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}