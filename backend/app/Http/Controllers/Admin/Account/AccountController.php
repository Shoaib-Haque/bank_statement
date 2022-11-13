<?php

namespace App\Http\Controllers\Admin\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Accounts;
use Exception;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    /**
     * Create a new AccountController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:admin');
        config(['auth.defaults.guard' => 'admin']);
    }

    /**
     * Get Account List
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return Accounts::select('*')->get();
    }

    /**
     * Create an Account.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $bank_id = $request->input('bank_id');
        $bank_name = $request->input('bank_name');
        $request->validate([
            'bank_id' => ['required', 'string', 'between:2,30',
            Rule::unique('accounts')->where(function ($query) use($bank_id,$bank_name) {
                return $query->where('bank_id', $bank_id)
                ->where('bank_name', $bank_name);
            })],
            'bank_name' => 'required|string|between:2,100',
            'password' => 'required|string|min:6',
        ]);

        try {
            Accounts::create(['bank_id' => $request->bank_id,
                              'bank_name' => $request->bank_name,
                              'password' => bcrypt($request->password)]);

            return response()->json([
                'message' => 'Account Created Successfully!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while creating an Account!!'
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
            $account = Accounts::find($id);
            if($account) {
                return response()->json([
                    'account' => $account
                ]);
            }
            return response()->json([
                'message' => 'Record not found!!'
            ], 404);
        } catch(\Exception $e) {
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
        $bank_id = $request->input('bank_id');
        $bank_name = $request->input('bank_name');
        $request->validate([
            'bank_id' => ['required', 'string', 'between:2,30',
            Rule::unique('accounts')->where(function ($query) use($bank_id,$bank_name) {
                return $query->where('bank_id', $bank_id)
                ->where('bank_name', $bank_name);
            })],
            'bank_name' => 'required|string|between:2,100',
        ]);

        try {
            $account = Accounts::find($id);
            $account->fill($request->post())->update();
            return response()->json([
                'message' => 'Account Updated Successfully!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while updating an Account!!'
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
            $account = Accounts::find($id);
            $account->delete();
            return response()->json([
                'message' => 'Account Deleted Successfully!!'
            ]);
        } catch(\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while deleting an Account!!'
            ], 500);
        }
    }
}
