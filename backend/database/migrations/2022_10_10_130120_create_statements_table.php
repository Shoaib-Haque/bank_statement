<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('statements', function (Blueprint $table) {
            $table->increments('id');
            $table->string('bank_id');
            $table->foreign('bank_id')->references('bank_id')->on('accounts');
            $table->integer('particulars_id')->unsigned();
            $table->foreign('particulars_id')->references('id')->on('particulars');
            $table->double('amount', 8);
            $table->string('entry', 6);
            $table->date('date');
        });

        \DB::statement('ALTER TABLE statements AUTO_INCREMENT = 1;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('statements');
    }
};
