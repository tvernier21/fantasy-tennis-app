'use client';

const SideBar = () => {
    console.log('sidebar')
    return (
        <div className="
        hidden 
        lg:fixed 
        lg:inset-y-0 
        lg:left-0 
        lg:z-40 
        lg:w-20 
        xl:px-6
        lg:overflow-y-auto 
        lg:bg-white 
        lg:border-r-[1px]
        lg:pb-4
        lg:flex
        lg:flex-col
        justify-between
      ">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            <li className="flex items-center justify-center">
                a
            </li>
            <li className="flex items-center justify-center">
                b
            </li>
            <li className="flex items-center justify-center">
                c
            </li>
          </ul>
        </nav>
      </div>
    )
}

export default SideBar;