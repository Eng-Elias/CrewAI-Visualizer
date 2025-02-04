import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-8">
                  CrewAI Visualizer
                </h1>
                
                <p className="text-gray-600">
                  Welcome to CrewAI Visualizer! This powerful tool helps you visualize and manage CrewAI workflows with ease.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Secure Authentication with Supabase
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Interactive Workflow Visualization
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Real-time Collaboration
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4 pt-6">
                  <Link 
                    href="/auth-test" 
                    className="block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-md
                      hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    Try Authentication
                  </Link>
                  
                  <a 
                    href="https://github.com/Eng-Elias/CrewAI-Visualizer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-md
                      hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                      transition-all duration-200 ease-in-out border border-gray-200"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
