<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Auth
use App\Http\Controllers\Auth\AccountAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
// Account
use App\Http\Controllers\Admin\Account\AccountController as AdminAccountController;
// Particulars
use App\Http\Controllers\Admin\Particular\ParticularController as AdminParticularController;

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

Route::group(['middleware' => 'admin', 'prefix' => 'accounts'],
    function ($router) {
        Route::get('/', [AdminAccountController::class, 'index']);
        Route::post('/', [AdminAccountController::class, 'create']);
        Route::get('/{id}', [AdminAccountController::class, 'show']);
        Route::post('/{id}/edit', [AdminAccountController::class, 'update']);
        Route::delete('/{id}', [AdminAccountController::class, 'destroy']);
    }
);

Route::group(['middleware' => 'admin', 'prefix' => 'particulars'],
    function ($router) {
        Route::get('/', [AdminParticularController::class, 'index']);
        Route::post('/', [AdminParticularController::class, 'create']);
        Route::get('/{id}', [AdminParticularController::class, 'show']);
        Route::post('/{id}/edit', [AdminParticularController::class, 'update']);
        Route::delete('/{id}', [AdminParticularController::class, 'destroy']);
    }
);
