<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Public
        //Broadcast::routes();

        // Private
        Broadcast::routes(['middleware' => ['auth:user']]); //add auth guard you are using here

        require base_path('routes/channels.php');
    }
}
