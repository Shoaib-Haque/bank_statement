<?php

namespace App\Http\Controllers\Admin\Particular;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Particulars;

class ParticularController extends Controller
{
    /**
     * Create a new ParticularController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:admin');
        config(['auth.defaults.guard' => 'admin']);
    }

    /**
     * Get Particulars List
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return Particulars::select('*')->get();
    }

    /**
     * Create an Particulars.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $request->validate([
            'particulars' => 'required|string|between:2,50|unique:particulars,particulars'
        ]);

        try {
            Particulars::create($request->post());

            return response()->json([
                'message' => 'Particulars Created Successfully!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while creating a Particulars!!'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $particulars = Particulars::find($id);
            if ($particulars) {
                return response()->json([
                    'particulars' => $particulars
                ]);
            }
            return response()->json([
                'message' => 'Record not found!!'
            ], 404);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something went wrong!!'
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'particulars' => 'required|string|between:2,50|unique:particulars,particulars,' . $id,
        ]);

        try {
            $Particulars = Particulars::find($id);
            $Particulars->fill($request->post())->update();
            return response()->json([
                'message' => 'Particulars Updated Successfully!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while updating a Particulars!!'
            ], 500);
        }
    }

    /**
     * Destroy the specified resource in storage.
     *
     * @param  int  $id
     */
    public function destroy($id)
    {
        try {
            $Particulars = Particulars::find($id);
            $Particulars->delete();
            return response()->json([
                'message' => 'Particulars Deleted Successfully!!'
            ]);
        } catch(\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while deleting a Particulars!!'
            ], 500);
        }
    }
}
