const Footer = () => {
    return (
      <footer className="bg-gray-50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-200 to-blue-200 rounded-full flex items-center justify-center">
                🧶
              </div>
              <span className="font-serif text-lg font-bold text-gray-800">Code & Knit</span>
            </div>
            
            <div className="flex space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-300 transition-colors">
                📧
              </div>
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-300 transition-colors">
                🐦
              </div>
              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-300 transition-colors">
                📷
              </div>
            </div>
            
            <p className="text-sm text-gray-600">© 2024 Code & Knit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer