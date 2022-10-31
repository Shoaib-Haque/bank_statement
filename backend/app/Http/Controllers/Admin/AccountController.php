<?php

namespace App\Http\Controllers\Admin;

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
        $validator = Validator::make($request->all(), [
            'bank_id' => 'required|string|between:2,30',
            'bank_name' => 'required|string|between:2,100',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
        try {
            $account = Accounts::create(array_merge(
                $validator->validated(),
                ['password' => bcrypt($request->password)]
            ));
        } catch(Exception $e) {
            return response()->json([
                'message' => 'Account successfully registered',
                'account' => $e
            ], 201);
        }
        return response()->json([
            'message' => 'Account successfully registered',
            'account' => $account
        ], 201);
    }
}
