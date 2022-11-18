<?php

namespace App\Http\Controllers\User\Message;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use Exception;
use Illuminate\Validation\Rule;

class MessageController extends Controller
{
    /**
     * Create a new StatementController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:user');
        config(['auth.defaults.guard' => 'user']);
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
            'message' => 'required',
            'receiver_id' => 'required'
        ]);

        try {
            Message::create([
                'sender_id' => auth()->user()->id,
                'message' => $request->message,
                'receiver_id' => $request->receiver_id,
                'created_at' => date('Y-m-d H:i:s'),
                'update_at' => date('Y-m-d H:i:s')
            ]);

            return response()->json([
                'message' => 'Sent!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Something goes wrong while sending message!!'
            ], 500);
        }
    }

}
