<?php

namespace App\Http\Controllers\User\Message;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use Exception;
use Illuminate\Validation\Rule;
use App\Events\MessageEvent;

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
     * Get Account List
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($receiver_id)
    {
        try {
            return Message::select('*')
                ->where(function($query) use($receiver_id) {
                    $query->where('sender_id', '=', auth()->user()->id);
                    $query->where('receiver_id', '=', $receiver_id);
                })
                ->orWhere(function($query) use($receiver_id) {
                    $query->where('sender_id', '=', $receiver_id);
                    $query->where('receiver_id', '=', auth()->user()->id);
                })
                ->orderBy('created_at', 'DESC')
                ->get();
        } catch(Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send Message
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function send(Request $request)
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

            event(new MessageEvent($request->receiver_id, $request->message));

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
