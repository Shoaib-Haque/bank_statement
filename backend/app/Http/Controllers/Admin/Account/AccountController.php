<?php

namespace App\Http\Controllers\Admin\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Accounts;
use Exception;
use Validator;

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
     * Register a Account.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
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
}
