# bank_statement
<h1>scratch</h1>
<h1>backend</h1>
<ol type="1">
    <li><strong>install laravel</strong><br>composer create-project laravel/laravel backend</li>
    <li><strong>change directory</strong><br>cd backend</li>
    <li><strong>run the server</strong><br>php artisan serve</li>
    <li><strong>create migration files</strong></li>
    <li><strong>migrate tables</strong><br>php artisan migrate</li>
</ol>
<h3>authentication</h3>
<ol type="1">
    <li><strong>authentication using jwt</strong><br>
        <a href="https://www.positronx.io/laravel-jwt-authentication-tutorial-user-login-signup-api/">laravel-jwt-authentication-tutorial</a>
    </li>
    <li><strong>install jwt</strong><br>composer require -w tymon/jwt-auth --ignore-platform-reqs</li>
    <li><strong>go to config/app.php</strong><br>
    <ul>
        <li>include the laravel service provider inside the providers array.<br>
            'providers' => [<br>
                ....<br>
                ....<br>
                Tymon\JWTAuth\Providers\LaravelServiceProvider::class,<br>
            ],<br>
        </li>
        <li>include the JWTAuth and JWTFactory facades inside the aliases array.<br>
            'aliases' => [<br>
                ....<br>
                'JWTAuth' => Tymon\JWTAuth\Facades\JWTAuth::class,<br>
                'JWTFactory' => Tymon\JWTAuth\Facades\JWTFactory::class,<br>
                ....<br>
            ],
        </li>
    </ul>
    <li><strong>publish the jwt package’s configuration</strong><br>
        php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"</li>
    <li><strong>generate jwt secret key</strong><br>php artisan jwt:secret</li>
    <li><strong>create a middleware for API</strong></li>
    <ul>
        <li>php artisan make:middleware Api</li>
        <li>copy class content from vendor\laravel\framework\src\Illuminate\Routing\Middleware\SubstituteBindings.php and paste inside Api.php</li>
    </ul>
    <li><strong>configure middleware: goto http/Kernel.php</strong><br></li>
    <ul>
        <li>
            protected $middlewareGroups = [<br>
                -------------------------------<br>
                'account' => [<br>
                    \App\Http\Middleware\Api::class,<br>
                ],<br>
                'admin' => [<br>
                    \App\Http\Middleware\Api::class,<br>
                ],<br>
                'user' => [<br>
                    \App\Http\Middleware\Api::class,<br>
                ],<br>
            ];
        </li>
    </ul>
    <li><strong>Configure Auth guard: goto config/auth.php</strong><br></li>
    <ul>
        <li>
        'guards' => [<br>
            'web' => [<br>
                'driver' => 'session',<br>
                'provider' => 'users',<br>
            ],<br>
            'account' => [<br>
                'driver' => 'jwt',<br>
                'provider' => 'accounts',<br>
                'hash' => false,<br>
            ],<br>
            'admin' => [<br>
                'driver' => 'jwt',<br>
                'provider' => 'admin',<br>
                'hash' => false,<br>
            ]<br>
        ],<br><br>
        'providers' => [<br>
            'users' => [<br>
                'driver' => 'eloquent',<br>
                'model' => App\Models\User::class,<br>
            ],<br>
            'accounts' => [<br>
                'driver' => 'eloquent',<br>
                'model' => App\Models\Accounts::class,<br>
            ],<br>
            'admin' => [<br>
                'driver' => 'eloquent',<br>
                'model' => App\Models\Admin::class,<br>
            ],<br>
            // 'users' => [<br>
            //     'driver' => 'database',<br>
            //     'table' => 'users',<br>
            // ],<br>
        ],
        </li>
    </ul>
    <li><strong>real-time-application-using-pusher</strong>
        <br><a href="https://hanieasemi.medium.com/realtime-application-with-laravel-and-react-js-88bf17be4838">RealTime Application with Laravel and React.js</a>
        <br><a href="https://medium.com/@ekponoambrose/laravel-pusher-without-echojs-628bf192cac7">Laravel + Pusher without Echojs</a>
    </li>
    <li><strong>install the Pusher Channels PHP SDK</strong><br>composer require pusher/pusher-php-server</li>
    <li><strong>create app on the Pusher website</strong>
        <br><a href="https://pusher.com/">Pusher</a>
    </li>
    <li><strong>change pusher credentials on .env</strong>
        <br>PUSHER_APP_ID, PUSHER_APP_SECRET, PUSHER_APP-KEY
    </li>
    <li><strong>change BROADCAST_DRIVER=pusher on .env</strong></li>
</li>
</ol>

<h1>frontend</h1>
<ol type="1">
    <li><strong>install react</strong><br>npx create-react-app frontend</li>
    <li><strong>change directory</strong><br>cd frontend</li>
    <li><strong>run the frontend</strong><br>npm run</li>
    <li><strong>install axios</strong><br>npm install axios react-bootstrap bootstrap</li>
    <li><strong>install react-router-dom</strong><br>npm install react-router-dom sweetalert2 --save</li>
    <li><strong>install react-bootstrap-table</strong>
        <br>npm i react-bootstrap-table-next --legacy-peer-deps
    </li>
    <li><strong>install react-bootstrap-table2-toolkit</strong>
        <br>npm i react-bootstrap-table2-toolkit --legacy-peer-deps
    </li>
    <li><strong>install react-helmet</strong><br>npm install react-helmet</li>
    <li><strong>install laravel-echo and pusher-js</strong><br>npm install laravel-echo pusher-js</li>
    <li><strong>add pusher credentials on .env</strong>
        <br>REACT_APP_PUSHER_API_KEY, REACT_APP_PUSHER_CLUSTER
    </li>
</ol>

<h1>clone</h1>
<h1>cloning</h1>
<ol type="1">
    <li><strong>clone repository</strong>
        <br>git clone https://github.com/Shoaib2018/bank_statement.git
    </li>
    <li><strong>change git local name and email if necessary</strong><br>
        <ul>
            <li>git config user.name "name"</li>
            <li>git config user.email "email"</li>
        </ul>
    </li>
</ol>

<h1>backend</h1>
<ol type="1">
    <li><strong>change directory</strong><br>cd backend</li>
    <li><strong>install composer</strong><br>composer install</li>
    <li><strong>copy .env.example and rename it to .env</strong><br>cp .env.example .env</li>
    <li><strong>change database credentials in .env</strong></li>
    <li><strong>change pusher credentials in .env</strong></li>
    <li><strong>change BROADCAST_DRIVER=pusher in .env</strong></li>
    <li><strong>generate app key</strong><br>php artisan key:generate</li>
    <li><strong>install jwt</strong><br>composer require -w tymon/jwt-auth --ignore-platform-reqs</li>
    <li><strong>copy and paste jwt secret key</strong></li>
    <li><strong>migrate tables</strong><br>php artisan migrate</li>
    <li><strong>run backend server</strong><br>php artisan serve</li>
</ol>

<h1>frontend</h1>
<ol type="1">
    <li><strong>change directory</strong><br>cd frontend</li>
    <li><strong>install node packages</strong><br>npm install</li>
    <li><strong>copy .env.local.example and rename it to .env.local</strong>
        <br>cp .env.local.example .env.local
    </li>
    <li><strong>run frontend server</strong><br>npm run start</li>
</ol>
