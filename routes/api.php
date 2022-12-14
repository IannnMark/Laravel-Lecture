<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/customer/all',['uses' => 'CustomerController@getCustomerAll','as' => 'customer.getcustomerall'] );
Route::resource('customer', 'CustomerController');


Route::get('/item/all',['uses' => 'ItemController@getItemAll','as' => 'item.getitemall'] );
Route::GET('/items/show/{id}', ['uses' => 'ItemController@getItem', 'as' => 'item.getitem'] );
Route::resource('item', 'ItemController');

Route::view('/item-index', 'item.index');

Route::post('/item/checkout',[
    'uses' => 'ItemController@postCheckout',
    'as' => 'checkout'
]);



