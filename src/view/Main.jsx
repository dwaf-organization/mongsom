import Mainwrapper from '../wrapper/Mainwrapper';

export default function Main() {
  return (
    <Mainwrapper>
      <div className="min-h-screen bg-gradient-to-brflex items-center justify-center ">
        <div className="bg-white rounded-xl shadow-lg  max-w-md w-full border border-gray-200">
          <h1 className="text-4xl font-bold text-black-100 text-center mb-6">
            Welcome to Main
          </h1>
          <p className="text-gray-700 text-lg text-center mb-8">
            This page uses our new custom color palette!
          </p>
          
          <div className="space-y-4">
            <button className="w-full bg-primary-200 hover:bg-primary-200/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="w-full bg-secondary-200 hover:bg-secondary-200/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Secondary Button
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <p className="text-center text-sm text-gray-700">
              Gray background with custom colors
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Color preview</p>
          </div>
        </div>
      </div>
    </Mainwrapper>
  );
}