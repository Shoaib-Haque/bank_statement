<?php

namespace App\Http\Controllers\Admin\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Accounts;

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
        $request->validate([
            'bank_id' => 'required|string|between:2,30',
            'bank_name' => 'required|string|between:2,100',
            'password' => 'required|string|min:6',
        ]);

        try {
            Accounts::create($request->post() + ['password' => bcrypt($request->password)]);

            return response()->json([
                'message' => 'Account Created Successfully!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while creating a statement!!'
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
        $account = Accounts::find($id);
        return response()->json([
            'account' => $account
        ]);
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
            'bank_id' => 'required|string|between:2,30',
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
        } catch(\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while deleting an Account!!'
            ], 500);
        }
    }
}
