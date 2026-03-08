

export default function BoxModel(){

   

    
    return(

        <>
        <div className="bg-red-500 text-white p-4">
        Tailwind Test
        </div>


        < div className=" p-6 ml-20 border-4 border-violet-500 bg-[#f3e8ff]">
        I am a box with padding, margin, and border.
        </div> 


        <div className="p-6 mt-20 border-4 border-violet-700 bg-[#f3e8ff] ">
        I am Box.I have padding inside,margin around me,and margin outside.
        </div>


        <div className="p-6 mt-20 mb-10 ml-32 mr-4 border-4 border-violet-500 bg-[#f3e8ff] "> 
         I am the the box. I have margin around me and padding inside me.
        </div>




        <div className="bg-yellow-100 min-h-screen p-8">
            <p className="font-bold text-lg mb-2"  >1. flex → items go in a ROW</p>
            <div className="flex bg-white border-2 border-gray-400 p-4 mb-8">

                <div className="bg-violet-400 text-white p-4 m-2">A</div>
                <div className="bg-violet-400 text-white p-4 m-2">B</div>
                <div className="bg-violet-400 text-white p-4 m-2">C</div>

            </div>

            <p className="font-bold text-lg mb-2"  >2. flex-col → items go in a COLUMN</p>
            <div className="flex flex-col bg-white border-2 border-gray-400 p-4 mb-8">
                <div className="bg-blue-400 text-white p-4 m-2">A</div>
                <div className="bg-blue-400 text-white p-4 m-2">B</div>
                <div className="bg-blue-400 text-white p-4 m-2">C</div>
            </div>

            <p className="font-bold text-lg mb-2"  >3. justify-between → push items to opposite ends</p>
            <div className="flex justify-between bg-white border-2 border-gray-400 p-4 mb-8">
                <div className="bg-green-400 text-white p-4 m-2">A</div>
                <div className="bg-green-400 text-white p-4 m-2">B</div>
                <div className="bg-green-400 text-white p-4 m-2">C</div>
                <div className="bg-green-400 text-white p-4 m-2">C</div>
            </div>

            <p className="font-bold text-lg mb-2">4. items-center → vertically center everything</p>
            <div className="flex items-center bg-white border-2 border-gray-400 p-4 mb-8">
                <div className="bg-red-400 text-white p-2 m-2">short</div>
                <div className="bg-red-400 text-white p-6 m-2">Tall</div>
                <div className="bg-red-400 text-white p-2 m-2">short</div>
            </div>
            <p className="font-bold text-lg mb-2">5. justify-between + items-center → Header pattern!</p>
      <div className="flex justify-between items-center bg-violet-600 text-white p-4 mb-8 rounded-xl">
        <span className="font-bold text-xl">Logo</span>
        <div className="flex gap-3">
          <button className="bg-white text-violet-600 px-4 py-2 rounded-lg font-semibold">Login</button>
          <button className="bg-white text-violet-600 px-4 py-2 rounded-lg font-semibold">Signup</button>
        </div>
      </div> 
        </div>
















        </>
    )   

}