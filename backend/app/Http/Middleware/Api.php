<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Contracts\Routing\Registrar;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Api
{
    /**
     * The router instance.
     *
     * @var \Illuminate\Contracts\Routing\Registrar
     */
    protected $router;

    /**
     * Create a new bindings.
     *
     * @param  \Illuminate\Contracts\Routing\Registrar  $router
     * @return void
     */
    public function __construct(Registrar $router)
    {
        $this->router = $router;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            $this->router->substituteBindings($route = $request->route());

            $this->router->substituteImplicitBindings($route);
        } catch (ModelNotFoundException $exception) {
            if ($route->getMissing()) {
                return $route->getMissing()($request, $exception);
            }

            throw $exception;
        }

        return $next($request);
    }
}