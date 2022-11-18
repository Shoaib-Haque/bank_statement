<?php

namespace App\Http\Controllers\Account\Statement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Statements;
use App\Models\Particulars;
use Exception;
use Illuminate\Validation\Rule;

class StatementController extends Controller
{
    /**
     * Create a new StatementController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:account');
        config(['auth.defaults.guard' => 'account']);
    }

    /**
     * Get Statement List
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return Statements::from('statements AS s')
                ->leftJoin('particulars as p', 'p.id', '=', 's.particulars_id')
                ->where('bank_id', '=', auth()->user()->bank_id)
                ->select('s.*', 'p.particulars')
                ->orderBy('s.date')
                ->get();
    }

    /**
     * Create Statement.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $request->validate([
            'particulars_id' => 'required',
            'amount' => 'required',
            'entry' => 'required',
            'date' => 'required',
        ]);

        try {
            Statements::create([
                'bank_id' => auth()->user()->bank_id, //auth()->user()->id;
                'particulars_id' => $request->particulars_id,
                'amount' => floatval($request->amount),
                'entry' => $request->entry,
                'date' => $request->date
            ]);

            return response()->json([
                'message' => 'Statement Saved!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while storing Statement Information!!'
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
            $statement = Statements::find($id);
            if ($statement) {
                return response()->json([
                    'statement' => $statement
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
            'particulars_id' => 'required',
            'amount' => 'required',
            'entry' => 'required',
            'date' => 'required',
        ]);

        try {
            $statement = Statements::find($id);
            $statement->fill([
                'bank_id' => auth()->user()->bank_id,
                'particulars_id' => $request->particulars_id,
                'amount' => floatval($request->amount),
                'entry' => $request->entry,
                'date' => $request->date
            ])->update();
            return response()->json([
                'message' => 'Statement Updated Successfully!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while updating Statement!!'
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
            $statement = Statements::find($id);
            $statement->delete();
            return response()->json([
                'message' => 'Statement Deleted Successfully!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while deleting Statement!!'
            ], 500);
        }
    }
}
