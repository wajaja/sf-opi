<?php

namespace OP\SocialBundle\SeveralClass;

/**
 * Description of DateTransformer
 *
 * @author CEDRICK
 */
class DateTransformer
{
    public function timestampTransform($dateTs)
    {
        
        $datetime = new \DateTime();
        $diff = $datetime->getTimestamp() - $dateTs;
        $date = [];
        //if date is greate than an day value in seconds
        if($diff > 2592000 ){
            $month = floor($diff / 2592000);
            $date['date']['month'] = $month;
            $diff = $diff % 2592000;
            if($diff > 86400){
                $day = floor($diff / 86400);
                $date['date']['day'] = $day;
                $rest = $diff % 86400;
                if($rest > 3600){
                    $hour = floor($rest / 3600);
                    $rest = $rest % 3600;
                    $date['time']['hour'] = $hour;
                    if($rest > 60){
                        $minute = floor($rest /60);
                        $date['time']['minute'] = $minute;
                        return $date;
                    }else{
                        return $date;
                    }
                }else{
                    return $date;
                }
            }
            return $date;
        }
        if($diff > 86400){
            $date['date']['month'] = 0;
            $rest = $diff % 86400;
            $date['date']['day'] = floor($diff / 86400);
            if($rest > 3600){
                $rest = $rest % 3600;
                $date['time']['hour'] = floor($rest / 3600);
                if($rest > 60){
                    $date['time']['minute'] = floor($rest /60);
                    return $date;
                }else{
                    $date['time']['minute'] = 0;
                    return $date;
                }
            }else{
                $date['time']['hour'] = 0;
                $date['time']['minute'] = 0;
                return $date;
            }
            $date['time']['hour'] = 0;
            $date['time']['minute'] = 0;
            return $date;
        }

        if($diff > 3600){
            $date['date']['month'] = 0;
            $date['date']['day'] = 0;
            $rest = $diff % 3600;
            $date['time']['hour'] = floor($diff / 3600);
            if($rest > 60){
                $date['time']['minute'] = floor($rest /60);
                return $date;
            }else{
                $date['time']['minute'] = 0;
                return $date;
            }
            return $date;
        }

        if($diff > 60){
            $date['date']['month'] = 0;
            $date['date']['day'] = 0;
            $date['time']['hour'] = 0;
            $date['time']['minute'] = floor($diff/60);
            return $date;
        }
        $date['date']['month'] = 0;
        $date['date']['day'] = 0;
        $date['time']['hour'] = 0;
        $date['time']['minute'] = 0;
        return $date;
    }
}
