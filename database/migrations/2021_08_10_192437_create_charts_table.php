<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('charts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->references('id')->on('articles')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedInteger('number_in_list');
            $table->string('title',255);
            $table->string('legend', 255)->nullable()->default(null);
            $table->enum('type', ['bar', 'horizontalBar', 'doughnut', 'pie', 'line'])->default('bar');
            $table->string('axis_x', 255)->nullable()->default(null);
            $table->string('axis_y', 255)->nullable()->default(null);
            $table->string('suffix', 20);
            $table->enum('is_data_labels_shown', ['true', 'false'])->default('true');
            $table->enum('is_verbal_rounding_enabled', ['true', 'false'])->default('true');
            $table->enum('is_verbal_rounding_enabled_for_hovered_labels', ['true', 'false'])->default('true');
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
        Schema::dropIfExists('charts');
    }
}
