<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountAuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\ParticularController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'account','prefix' => 'account'],
    function ($router) {
        Route::post('/login', [AccountAuthController::class, 'login']);
        Route::post('/logout', [AccountAuthController::class, 'logout']);
        Route::get('/account-profile', [AccountAuthController::class, 'accountProfile']);
    }
);

Route::group(['middleware' => 'admin', 'prefix' => 'admin'],
    function ($router) {
        Route::post('/login', [AdminAuthController::class, 'login']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/particulars', [ParticularController::class, 'index']);
    }
);

Route::group(['middleware' => 'admin', 'prefix' => 'account'],
    function ($router) {
        Route::post('/register', [AdminAccountController::class, 'register']);
    }
);
