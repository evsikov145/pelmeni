<?php

header("Content-Type: text/html; charset=utf-8");


if(isset($_POST)) {

//АВТОРИЗАЦИЯ
$user=array(
	'USER_LOGIN'=>'maks-payne@mail.ru', #Ваш логин (электронная почта)
	'USER_HASH'=>'acba60895ba4c0a257254062d45144a8a9b07f79' #Хэш для доступа к API (смотрите в профиле пользователя)
);

$lead_name = 'Заявка с сайта'; //Название добавляемой сделки

$lead_status_id = '3388360'; //id этапа продаж, куда помещать сделку

$responsible_user_id = "6148339";
$subdomain='makspayne';

$name = $_POST['name'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$sum = $_POST['sum'];
$payment = $_POST['payment'];
$data = json_decode($_POST['message'], true);
$date = $_POST['date'];
$time = $_POST['time'];

if(isset($data) && !empty($data) ){
   $content = "\r\n";
   foreach ($data as $key => $value){
       $content .= $value['title']." - Стоимость: ".$value['price']." - Количество: ".$value['number'].";"."\r\n";
   }

$paramsArray = array(
		'fields' => array (
			'name_1' => $name,
			'77085_1' => array( '107011' => $phone ),
			'315961_1' => $address,
			'note_2' => $content,
			'price_2'=> $sum,
			'315963_1' => $payment,
			'334889_1' => $date,
			'334891_1' => $time
		),
		'form_id' => '697279',
		'hash' => 'acba60895ba4c0a257254062d45144a8a9b07f79'
	);
	// преобразуем массив в URL-кодированную строку
$vars = http_build_query($paramsArray);
	// создаем параметры контекста
$options = array(
		'http' => array(
			'method'  => 'POST',  // метод передачи данных
			'header'  => 'Content-type: application/x-www-form-urlencoded',  // заголовок
			'content' => $vars  // переменные
		)
	);

//https://forms.amocrm.ru/cxzvzx
//АВТОРИЗАЦИЯ
#Формируем ссылку для запроса
$link='https://'.$subdomain.'.amocrm.ru/private/api/auth.php?type=json';
$curl=curl_init(); #Сохраняем дескриптор сеанса cURL
#Устанавливаем необходимые опции для сеанса cURL
curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
curl_setopt($curl,CURLOPT_URL,$link);
curl_setopt($curl,CURLOPT_POST,true);
curl_setopt($curl,CURLOPT_POSTFIELDS,http_build_query($user));
curl_setopt($curl,CURLOPT_HEADER,false);
curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
$out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
$code=curl_getinfo($curl,CURLINFO_HTTP_CODE); #Получим HTTP-код ответа сервера
curl_close($curl);  #Завершаем сеанс cURL
$Response=json_decode($out,true);
//echo '<b>Авторизация:</b>'; echo '<pre>'; print_r($Response); echo '</pre>';
//$log = date('Y-m-d H:i:s') . ' ' . print_r("Авторизация: ".$out."</br>", true);
//file_put_contents(__DIR__ . '/log.txt', $log . PHP_EOL, FILE_APPEND);

//ПОЛУЧАЕМ ДАННЫЕ АККАУНТА
$link='https://'.$subdomain.'.amocrm.ru/private/api/v2/json/accounts/current'; #$subdomain уже объявляли выше
$curl=curl_init(); #Сохраняем дескриптор сеанса cURL
#Устанавливаем необходимые опции для сеанса cURL
curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
curl_setopt($curl,CURLOPT_URL,$link);
curl_setopt($curl,CURLOPT_HEADER,false);
curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
$out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
$code=curl_getinfo($curl,CURLINFO_HTTP_CODE);
curl_close($curl);
$Response=json_decode($out,true);
$account=$Response['response']['account'];
$account_id = $Response['response']['account']['users'][0]['id'];//id аккаунта
$hash_id = $out['response']['account']['uuid'];
//echo '<b>Данные аккаунта:</b>'; echo '<pre>'; print_r($Response); echo '</pre>';
//$log = date('Y-m-d H:i:s') . ' ' . print_r("Данные аккаунта: ".$Response['response']['account']['uuid']."</br>", true);
//file_put_contents(__DIR__ . '/log.txt', $log . PHP_EOL, FILE_APPEND);
$responsible_user_id = $Response['response']['account']['id'];
//ПОЛУЧАЕМ СУЩЕСТВУЮЩИЕ ПОЛЯ
$amoAllFields = $account['custom_fields']; //Все поля
$amoConactsFields = $account['custom_fields']['contacts']; //Поля контактов
//echo '<b>Поля из амо:</b>'; echo '<pre>'; print_r($amoConactsFields); echo '</pre>';
//$log = date('Y-m-d H:i:s') . ' ' . print_r("Поля: ".$out."</br>", true);
//file_put_contents(__DIR__ . '/log.txt', $log . PHP_EOL, FILE_APPEND);
//ДОБАВЛЯЕМ СДЕЛКУ
$leads['add']=array(
    array(
        'name' => $lead_name,
        'status_id' => $lead_status_id, //id статуса
        'responsible_user_id' => $responsible_user_id, //id ответственного по сделке
        //'date_create'=>1298904164, //optional
        'price'=>$sum,
        //'tags' => 'TEST', //Теги
        'custom_fields'=>array(
			array(
                'id' => 'note',
                'values' => array(
                    array(
                        'value' => $content
                    )
                )
            )
		)
    )
);
$link='https://'.$subdomain.'.amocrm.ru/api/v2/leads';
$curl=curl_init(); //Сохраняем дескриптор сеанса cURL
//Устанавливаем необходимые опции для сеанса cURL
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-API-client/1.0');
curl_setopt($curl, CURLOPT_URL, $link);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($leads));
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl,CURLOPT_COOKIEFILE,__DIR__.'/cookie.txt');
curl_setopt($curl,CURLOPT_COOKIEJAR,__DIR__.'/cookie.txt');
curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
$out=curl_exec($curl); //Инициируем запрос к API и сохраняем ответ в переменную
$code=curl_getinfo($curl,CURLINFO_HTTP_CODE);
$Response=json_decode($out,true);
//$log = date('Y-m-d H:i:s') . ' ' . print_r("Созданная сделка: ".$out."</br>", true);
//file_put_contents(__DIR__ . '/log.txt', $log . PHP_EOL, FILE_APPEND);
//echo '<b>Новая сделка:</b>'; echo '<pre>'; print_r($Response); echo '</pre>';
if(is_array($Response['_embedded']['items'])){
	foreach($Response['_embedded']['items'] as $lead) {
		$lead_id = $lead["id"]; //id новой сделки
	}
}
//ДОБАВЛЯЕМ СДЕЛКУ - КОНЕЦ
//$log = date('Y-m-d H:i:s') . ' ' . print_r("Обновление сделки: ".$out."</br>", true);
//file_put_contents(__DIR__ . '/log.txt', $log . PHP_EOL, FILE_APPEND);

//ОБНОВЛЯЕМ НАЗВАНИЕ СДЕЛКИ - НАЧАЛО
unset($leads);
$leads['update']=array(
  array(
    'id'=>$lead_id,
    'name'=>'Сделка #'.$lead_id,
	'updated_at'=> time(),
	//'status_id'=>
	//'responsible_user_id' => $responsible_user_id //id ответственного по сделке
	)
);

$link='https://'.$subdomain.'.amocrm.ru/api/v2/leads';

$curl=curl_init(); #Сохраняем дескриптор сеанса cURL
#Устанавливаем необходимые опции для сеанса cURL
curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
curl_setopt($curl,CURLOPT_URL,$link);
curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($leads));
curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
curl_setopt($curl,CURLOPT_HEADER,false);
curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);

$out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
$code=curl_getinfo($curl,CURLINFO_HTTP_CODE);
$Response=json_decode($out,true);
//ОбНОВЛЯЕМ НАЧАЛО СДЕЛКИ - КОНЕЦ

//ДОБАВЛЕНИЕ КОНТАКТА
$contacts['add'][] = array(
    'name' => $name,
    'leads_id' => array($lead_id), //id сделки
    'responsible_user_id' => $responsible_user_id, //id ответственного
	'custom_fields' => array(
	    array(
            'id' => '77085',
            'values' => array(
                array(
                    'value' => $phone,
                    'enum' => 'WORK'
                )
            )
        ),
		array(
            'id' => '334891',
            'values' => array(
                array(
                    'value' => $time
                )
            )
        ),
		array(
            'id' => '334889',
            'values' => array(
                array(
                    'value' => $date
                )
            )
        ),
		array(
            'id' => '315963',
            'values' => array(
                array(
                    'value' => $payment
                )
            )
        ),
		array(
            'id' => '315961',
            'values' => array(
                array(
                    'value' => $address
                )
            )
        )
	)
);
//echo '<pre>'; print_r($contacts); echo '</pre>';

$link = 'https://' . $subdomain . '.amocrm.ru/api/v2/contacts';
$curl = curl_init(); //Сохраняем дескриптор сеанса cURL
//Устанавливаем необходимые опции для сеанса cURL
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-API-client/1.0');
curl_setopt($curl, CURLOPT_URL, $link);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($contacts));
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_COOKIEFILE, __DIR__ . '/cookie.txt');
curl_setopt($curl, CURLOPT_COOKIEJAR, __DIR__ . '/cookie.txt');
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
$out = curl_exec($curl);
$Response=json_decode($out,true);
//echo '<b>Новый контакт:</b>'; echo '<pre>'; print_r($Response); echo '</pre>';
//ДОБАВЛЕНИЕ КОНТАКТА - КОНЕЦ

//$log = date('Y-m-d H:i:s') . ' ' . print_r("Добавление контакта: ".$out."</br>", true);
//file_put_contents(__DIR__ . '/log.txt', $log . PHP_EOL, FILE_APPEND);

//ДОБАВЛЕНИЕ ПРИМЕЧАНИЯ - НАЧАЛО
$text['add'] = array(
    "entity_id"=> $lead_id,
	"created_by"=> intval($account_id),
    "note_type"=> "common",
    "params"=> array(
        "text"=> $content
    )
);
$entity_type = "leads";
$link = 'https://' . $subdomain . '.amocrm.ru/api/v4/'.$entity_type.'/notes';
$curl = curl_init(); //Сохраняем дескриптор сеанса cURL
//Устанавливаем необходимые опции для сеанса cURL
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-API-client/1.0');
curl_setopt($curl, CURLOPT_URL, $link);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($text));
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_COOKIEFILE, __DIR__ . '/cookie.txt');
curl_setopt($curl, CURLOPT_COOKIEJAR, __DIR__ . '/cookie.txt');
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
$out = curl_exec($curl);
$Response=json_decode($out,true);
//ДОБАВЛЕНИЕ ПРИМЕЧАНИЯ - КОНЕЦ
//$log = date('Y-m-d H:i:s') . ' ' . print_r("Добавление примечания: ".$out."</br>", true);
//file_put_contents(__DIR__ . '/log.txt', $log . PHP_EOL, FILE_APPEND);
$email = "hunter37ru@yandex.ru"; #Email, на него придут письма
$title = "Заказ с сайта "; #Заголовок письма
$text = "
Информация о покупателе:

Имя: ".$name."
Телефон: ".$phone."
Адрес: ".$address."
Заказ: ".$content."
Общая сумма заказа: ".$sum." рублей.
Оплата: ".$payment."
Дата доставки: ".$date."
Время доставки: ".$time."
Заявка пришла с сайта:" . $_SERVER['HTTP_REFERER'] ."
Время заказа: ".date("Y-m-d H:i:s")."
IP адрес клиента: ". $_SERVER['REMOTE_ADDR'];

    if(mail($email, $title, $text)) {
    	//header('Location: thanks.html');
    } else {
    	echo "Ошибка. Возможно функция mail отключена. Обратитесь к хостинг-провайдеру или возьмите консультацию на сайте, где купили шаблон";
    }
}
} else {
	echo "Ошибка";
}