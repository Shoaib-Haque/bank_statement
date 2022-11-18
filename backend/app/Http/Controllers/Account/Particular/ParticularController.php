<?php

namespace App\Http\Controllers\Account\Particular;

use App\Http\Controllers\Controller;
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
        $this->middleware('auth:account');
        config(['auth.defaults.guard' => 'account']);
    }

    /**
     * Get Particulars List
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return Particulars::select('*')
                ->orderBy('particulars')
                ->get();
    }
}
