# bank_statement
<h1>scratch</h1>
<h1>backend</h1>
<ol type="1">
    <li><strong>install laravel</strong><br>composer create-project laravel/laravel backend</li>
    <li><strong>change directory</strong><br>cd backend</li>
    <li><strong>run the server</strong><br>php artisan serve</li>
    <li><strong>create migration files</strong></li>
    <li><strong>migrate tables</strong><br>php artisan migrate</li>
    <li><h3>authentication</h3></li>
    <li><strong>install jwt</strong><br>composer require -w tymon/jwt-auth --ignore-platform-reqs</li>
    <li><strong>go to config/app.php</strong><br>
    <ul>
        <li>include the laravel service provider inside the providers array.</li>
        <li>include the JWTAuth and JWTFactory facades inside the aliases array.</li><br>
        <li>'providers' => [
                    ....
                    ....
                    Tymon\JWTAuth\Providers\LaravelServiceProvider::class,
                ],
                'aliases' => [
                    ....
                    'JWTAuth' => Tymon\JWTAuth\Facades\JWTAuth::class,
                    'JWTFactory' => Tymon\JWTAuth\Facades\JWTFactory::class,
                    ....
                ],
        </li>
    </ul>
</li>
</ol>

<h1>frontend</h1>
<ol type="1">
    <li><strong>install react</strong><br>npx create-react-app frontend</li>
    <li><strong>change directory</strong><br>cd frontend</li>
    <li><strong>run the frontend</strong><br>npm run</li>
</ol>

<h1>clone</h1>
<h1>cloning</h1>
<ol type="1">
    <li><strong>clone repository</strong><br>git clone https://github.com/Shoaib2018/bank_statement.git</li>
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
    <li><strong>generate app key</strong><br>php artisan key:generate</li>
    <li><strong>migrate tables</strong><br>php artisan migrate</li>
    <li><strong>run the server</strong><br>php artisan serve</li>
</ol>

<h1>frontend</h1>
<ol type="1">
    <li><strong>change directory</strong><br>cd frontend</li>
    <li><strong>install react</strong><br>npm install</li>
    <li><strong>run the frontend</strong><br>npm start</li>
</ol>
