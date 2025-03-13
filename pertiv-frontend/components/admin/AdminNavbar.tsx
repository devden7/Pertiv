const AdminNavbar = () => {
  return (
    <header>
      <nav className="bg-blue-700">
        <div className="container px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex space-x-4">
              <p className="text-white">Hi, Admin</p>
            </div>
            <div>
              <div className="relative ml-3">
                <div className="rounded-full">
                  <div className="size-8 rounded-full bg-red-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;
