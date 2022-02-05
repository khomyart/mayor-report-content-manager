<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChartDatasetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chart_datasets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chart_id')->references('id')->on('charts')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->string('label', 255);
            $table->float('value', 0, 0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chart_datasets');
    }
}
