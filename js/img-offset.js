//로컬 이미지 미리 보기
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var wrap = document.querySelector('.wrap');
    var rect = document.querySelector('.move-event-area');
    wrap.classList.add('is-hide');
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    '" title="', escape(theFile.name), '"/>'].join('');
                span.classList.add('img-wrap');
                document.getElementById('list').insertBefore(span, null);
            };
        })(f);
        rect.classList.add('is-show');
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}
function handleFileSelectReset() {
    const wrap = document.querySelector('.wrap');
    const moveArea = document.querySelector('.move-event-area');
    const rect = document.querySelector('.rect-box');
    const output = document.querySelector('.local-img-output');
    const child = output.querySelector('.img-wrap');
    const input = document.getElementById('files');
    const options = document.querySelector(".options");
    const $viewWidth = document.querySelector(".rect-box-width");
    const $viewHeight = document.querySelector(".rect-box-height");

    if(child !== null && child !== undefined){
        moveArea.classList.remove('is-show');
        wrap.classList.remove('is-hide');
        output.removeChild(child);
        input.value = "";
        options.classList.remove("is-show")
        moveArea.style.top = "0"
        moveArea.style.left = "0"
        rect.style.width = "200px"
        rect.style.height = "120px"
        $viewWidth.innerHTML = ""
        $viewHeight.innerHTML = ""
    } else {
        console.log('불러온 이미지가 없습니다.');
        return false;
    }
}
function getAlphaTarget (el, className) {
    var $target = $(el);
    var $this = $(className);
    var $value = $this.val()/10;
    $target.css({
        "opacity" : $value ,
    });
    $this.next('.result-value').text( $value );
}
function resizeStart (e) {
    var $pageX = e.pageX;
    var $pageY = e.pageY;
    var $btnWidth = $(".resize-btn").width();
    var $btnHeight = $(".resize-btn").height();
    var $rect = $('.rect-box');
    var $rectTop = $rect.offset().top;
    var $rectLeft = $rect.offset().left;
    var $sumY = $pageY - parseInt($rectTop - $btnHeight);
    var $sumX = $pageX - parseInt($rectLeft - $btnWidth);
    var $imgWrapWidth = $(".img-wrap").width();
    var $imgWrapHeight = $(".img-wrap").height();
    const $viewWidth = $(".rect-box-width")
    const $viewHeight = $(".rect-box-height")

    if($sumX <= 20 || Math.sign($sumX) === -1 ){
        $sumX = 20;
    }
    if( $sumY <= 20 || Math.sign($sumY) === -1 ){
        $sumY = 20;
    }
    if( $sumX > $imgWrapWidth){
        $sumX = $imgWrapWidth;
    }
    if ( $sumY > $imgWrapHeight){
        $sumY = $imgWrapHeight;
    }
    $rect.width($sumX).height($sumY);
    $viewWidth.html($sumX + "px")
    $viewHeight.html($sumY + "px")
}

function moveWrapClone(el, target){
    let $scrollY = $('html, body').scrollTop();
    let $scrollX = $('html, body').scrollLeft();
    let $thisTop = parseInt($(el).offset().top - $scrollY);
    let $thisLeft = parseInt($(el).offset().left - $scrollX);
    let $wrap = $(target);
    $wrap.css({
        "top":  $thisTop + 'px',
        "left" : $thisLeft + 'px',
        "transform" : "translate(0)"
    });
}

function resizeMoveGetData() {
    let $winW = $(window).width();
    let $wrapLeft = $('.img-wrap').width();
    let $wrapTop = $('.img-wrap').height();
    let $imgLeft = ($winW - $wrapLeft)/2;
    let $btnW = $(".move-event-area").width();
    let $btnH = $(".move-event-area").height();
    let $thisTop = $(".move-event-area").offset().top;
    let $thisLeft = $(".move-event-area").offset().left;
    let $cssLeft = parseInt($thisLeft - $imgLeft);
    let $cssTop = $thisTop;
    let $perTop = ($thisTop/$wrapTop) * 100;
    let $perLeft = ($cssLeft/$wrapLeft) * 100;
    let $perWidth = ($btnW/$wrapLeft) * 100;
    let $perHeight = ($btnH/$wrapTop) * 100;

    if($cssLeft < 0 || $wrapLeft < $cssLeft || $thisTop > $wrapTop || 0 > $thisTop){
        $cssLeft = null;$cssTop = null;
    }
    if($perTop > 100 || $perTop < 0 || $perLeft > 100 || $perLeft < 0 ) {
        $perTop = null;$perLeft = null;
    }
    draggableOffsetLeft = $cssLeft;
    draggableOffsetTop = $cssTop - 1;
    draggableOffsetTopPer = $perTop;
    draggableOffsetLeftPer = $perLeft;
    draggableOffsetWidthPer = $perWidth;
    draggableOffsetHeightPer = $perHeight;
    $btnResultWidth = $btnW;
    $btnResultHeight = $btnH;
}
function resizeMoveDrawData() {
    const input = $(".make-box").find('.input-area').children();

    if(draggableOffsetTopPer !== null || draggableOffsetTopPer !== undefined && draggableOffsetLeftPer !== null && draggableOffsetLeftPer !== undefined){
        $('#result-per').val("top:" + (draggableOffsetTopPer - 0.02).toFixed(2)  + "%;left:"+ draggableOffsetLeftPer.toFixed(2) +'%;width:'+ draggableOffsetWidthPer.toFixed(2) + '%;height:' + draggableOffsetHeightPer.toFixed(2) + '%;');
    } else {
        $('#result-per').val("top:" + null + ";left:"+ null +';width:' + null + ';height:' + null);
    }
    if(input[0].value !== null && input[0].value !== undefined){
        $('#result-px').val("top:" + draggableOffsetTop + "px;left:"+ draggableOffsetLeft +'px;width:' + $btnResultWidth + 'px;height:'+ $btnResultHeight +'px');
    } else {
        $('#result-px').val("top:" + draggableOffsetTop + "px;left:"+ draggableOffsetLeft +'px;width:' + input[0].value + 'px;height:'+ input[1].value +'px');
    }
}
function appendBtn ($target) {
    var $body = $('body');
    var $tg = $($target).val();
    if($tg !== null && $tg !== undefined && $tg !== ''){
        $body.append('<div class="fixed-dim"><textarea><a href="" title="내용" class="tp_btn" style="' + $tg + '" target="_self"><span class="hidden">내용</span></a></textarea></div>');
        $('.fixed-dim').children('textarea').select();
        document.execCommand('Copy');
        setTimeout(function(){
            $('.fixed-dim').remove();
        },300);
    } else {
        alert('정확한 수치가 없습니다.');
        return false;
    }
}
function boardCopyEvent(el) {
    var $getText = $(el);
    var $value = $getText.val();
    if($value !== null && $value !== undefined && $value !== ''){
        $getText.select();
        document.execCommand('Copy');
    } else {
        alert('정확한 수치가 없습니다.');
    }

}
function mouseEventKeyMove(direction) {
    var $direction = direction;
    var $target = $('.move-event-area');
    var $top = $target.css('top').replace(/[^0-9]/g,"");
    var $left = $target.css('left').replace(/[^0-9]/g,"");

    switch($direction){
        case 'l':
            $target.css({
                "left" : $left - 1,
            });
            resizeMoveGetData();
            resizeMoveDrawData();
            break;
        case 'r':
            $target.css({
                "left" : $left - (-1),
            });
            resizeMoveGetData();
            resizeMoveDrawData();
            break;
        case 't':
            $target.css({
                "top" : $top - 1,
            });
            resizeMoveGetData();
            resizeMoveDrawData();
            break;
        case 'b':
            $target.css({
                "top" : $top -(-1),
            });
            resizeMoveGetData();
            resizeMoveDrawData();
            break;
        default:
            break;
    }
}

function colorChangeRadioEvent($el, $target) {
    var $parent = $($el);
    var $radio = $parent.find("input:checked");
    var $getId = $radio.attr('id');
    var $tG = $($target);

    switch ($getId) {
        case "colorSelect1":
            $tG.css({
                'background': '#000'
            });
            break;
        case "colorSelect2":
            $tG.css({
                'background': '#0F92F7'
            });
            break;
        case "colorSelect3":
            $tG.css({
                'background': '#f70000'
            });
            break;
        case "colorSelect4":
            $tG.css({
                'background': '#fff300'
            });
            break;
        default :
            break;
    }
}

function fixedTopTarget (e) {
    var $this = $(e.composedPath()[0]);
    var $target = $('.move-event-area');
    var $getTop = $target.css('top');
    $this.toggleClass('is-active');
    if($this.hasClass('is-active')){
        fixeding = true;
        $this.text('고정 중');
        $thisTop = $('.move-event-area').css('top');
    } else {
        $this.text('고정');
        fixeding = false;
    }
}
function clickToggleClassEvent(el, className) {
    const elem = document.querySelector(el)
    document.querySelector(".local-img-output").children.length > 0 ?
        elem.classList.toggle(className)
        : alert("선택된 이미지가 없습니다.")
}

var resizing = false;
var dragging = false;
var fixeding = false;

var draggableOffsetLeft = '';
var draggableOffsetTop = '';
var draggableOffsetTopPer ='';
var draggableOffsetLeftPer ='';
var draggableOffsetWidthPer ='';
var draggableOffsetHeightPer = '';
var $btnResultWidth = '';
var $btnResultHeight = '';
var $fixedTop = '';
var $thisTop ='';

$(document).ready(function() {
    $(document).on('keydown',function(e) {
        var $key = e.keyCode;
        switch($key){
            case 37 : // left
                e.preventDefault();
                mouseEventKeyMove('l');
                break;
            case 38 : // top
                e.preventDefault();
                mouseEventKeyMove('t');
                break;
            case 39 : // right
                e.preventDefault();
                mouseEventKeyMove('r');
                break;
            case 40 : // bottom
                e.preventDefault();
                mouseEventKeyMove('b');
                break;
            default:
                break;
        }
    });
    $(document).on('click','.move-event-area',function(){
        resizeMoveGetData();
        resizeMoveDrawData();
        return false;
    });
    $(document).on('mousedown', ".rect-box",function(){
        //console.log("렉트 박스 : 마우스 다운");
        dragging = true;
        return false;
    });
    $(document).on("mousedown" , ".resize-btn", function() {
        //console.log("리사이즈버튼 마우스 다운");
        resizing = true;
        return false;
    });

    $(document).on("mousemove", function(e) {
        if (resizing) {
            //console.log("리사이즈버튼 마우스 무브");
            resizeStart(e);
            resizeMoveGetData();
            return false;
        }
        if(dragging){

            moveWrapClone('.rect-box', ".move-event-area");
            resizeMoveGetData();
            //console.log("렉트 박스 : 마우스 무브");
            return false;
        }
    });
    $(document).on("mouseup", function() {
        if (resizing) {
            // console.log("리사이즈버튼 마우스 업");
            resizeMoveGetData();
            resizeMoveDrawData();
            resizing = false;
            return false;
        }
        if (dragging) {
            if(fixeding){
                $('.move-event-area').css({'top': $thisTop});
                $('.move-event-area').click();
            }
            //console.log("렉트 박스 : 마우스 업");
            var $rect = $('.rect-box');
            $rect.css({'top': '0', 'left': '0'});
            resizeMoveGetData();
            resizeMoveDrawData();
            dragging = false;
            return false;
        }
    });
    $(document).on('click', '.fixed-dim', function() {
        $(this).remove();
    });
    $(document).on('click','.change-btn', function() {
        const input = $(".make-box").find('.input-area').children();
        const $target = $('.rect-box');
        const $viewWidth = $(".rect-box-width")
        const $viewHeight = $(".rect-box-height")
        for (var i = 0; i < input.length ; i++) {
            $target.css({
                'width' : input[0].value + 'px',
                'height' : input[1].value + 'px',
            })
            $viewWidth.text(input[0].value + "px")
            $viewHeight.text(input[1].value + "px")

        }
    });
    /* 20190424 추가 드레그 범위 지정 - 이벤트 버블링 현상  */
    $(document).on('mouseenter', '.box-control', function(){
        $('.make-box').draggable({disabled: true});
    });
    $(document).on('mouseleave', '.box-control', function(){
        $('.make-box').draggable({disabled: false});
    });
    $('.rect-box').draggable({containment : '.img-wrap'});
    $('.make-box').draggable({containment : '.img-wrap',handle : '.drag-area'})

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
});