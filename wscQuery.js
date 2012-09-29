function myAddEvent(obj, sEv, fn)
{
    if(obj.attachEvent)
    {
        obj.attachEvent('on'+sEv, function (){
            if(false==fn.call(obj))
            {
                event.cancelBubble=true;
                return false;
            }
        });
    }
    else
    {
        obj.addEventListener(sEv, function (ev){
            if(false==fn.call(obj))
            {
                ev.cancelBubble=true;
                ev.preventDefault();
            }
        }, false);
    }
}

function getByClass(oParent, sClass)
{
    var aEle=oParent.getElementsByTagName('*');
    var aResult=[];
    var i=0;
    
    for(i=0;i<aEle.length;i++)
    {
        if(aEle[i].className==sClass)
        {
            aResult.push(aEle[i]);
        }
    }
    
    return aResult;
}

function getStyle(obj, attr)
{
    if(obj.currentStyle)
    {
        return obj.currentStyle[attr];
    }
    else
    {
        return getComputedStyle(obj, false)[attr];
    }
}

function wscQuery(vArg)
{
    //用来保存选中的元素
    this.elements=[];
    
    switch(typeof vArg)
    {
        case 'function':
            myAddEvent(window, 'load', vArg);
            break;
        case 'string':
            switch(vArg.charAt(0))
            {
                case '#':   //ID选择器
                    var obj=document.getElementById(vArg.substring(1));
                    
                    this.elements.push(obj);
                    break;
                case '.':   //class
                    this.elements=getByClass(document, vArg.substring(1));
                    break;
                default:    //tagName
                    this.elements=document.getElementsByTagName(vArg);
            }
            break;
        case 'object':
            this.elements.push(vArg);
    }
}

wscQuery.prototype.click=function (fn)
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        myAddEvent(this.elements[i], 'click', fn);
    }
    
    return this;
};

wscQuery.prototype.show=function ()
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        this.elements[i].style.display='block';
    }
    
    return this;
};

wscQuery.prototype.hide=function ()
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        this.elements[i].style.display='none';
    }
    
    return this;
};

wscQuery.prototype.hover=function (fnOver, fnOut)
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        myAddEvent(this.elements[i], 'mouseover', fnOver);
        myAddEvent(this.elements[i], 'mouseout', fnOut);
    }
    
    return this;
};

wscQuery.prototype.css=function (attr, value)
{
    if(arguments.length==2) //设置样式
    {
        var i=0;
        
        for(i=0;i<this.elements.length;i++)
        {
            this.elements[i].style[attr]=value;
        }
    }
    else    //获取样式
    {
        if(typeof attr=='string')
        {
        //return this.elements[0].style[attr];
            return getStyle(this.elements[0], attr);
        }
        else
        {
            for(i=0;i<this.elements.length;i++)
            {
                var k='';
                
                for(k in attr)
                {
                    this.elements[i].style[k]=attr[k];
                }
            }
        }
    }
    
    return this;
};

wscQuery.prototype.attr=function (attr, value)
{
    if(arguments.length==2)
    {
        var i=0;
        
        for(i=0;i<this.elements.length;i++)
        {
            this.elements[i][attr]=value;
        }
    }
    else
    {
        return this.elements[0][attr];
    }
    
    return this;
};

wscQuery.prototype.toggle=function ()
{
    var i=0;
    var _arguments=arguments;
    
    for(i=0;i<this.elements.length;i++)
    {
        addToggle(this.elements[i]);
    }
    
    function addToggle(obj)
    {
        var count=0;
        myAddEvent(obj, 'click', function (){
            _arguments[count++%_arguments.length].call(obj);
        });
    }
    
    return this;
};

wscQuery.prototype.eq=function (n)
{
    return $(this.elements[n]);
};

function appendArr(arr1, arr2)
{
    var i=0;
    
    for(i=0;i<arr2.length;i++)
    {
        arr1.push(arr2[i]);
    }
}

wscQuery.prototype.find=function (str)
{
    var i=0;
    var aResult=[];
    
    for(i=0;i<this.elements.length;i++)
    {
        switch(str.charAt(0))
        {
            case '.':   //class
                var aEle=getByClass(this.elements[i], str.substring(1));
                
                aResult=aResult.concat(aEle);
                break;
            default:    //标签
                var aEle=this.elements[i].getElementsByTagName(str);
                
                //aResult=aResult.concat(aEle);
                appendArr(aResult, aEle);
        }
    }
    
    var newQuery=$();
    
    newQuery.elements=aResult;
    
    return newQuery;
};

function getIndex(obj)
{
    var aBrother=obj.parentNode.children;
    var i=0;
    
    for(i=0;i<aBrother.length;i++)
    {
        if(aBrother[i]==obj)
        {
            return i;
        }
    }
}

wscQuery.prototype.index=function ()
{
    return getIndex(this.elements[0]);
};

wscQuery.prototype.bind=function (sEv, fn)
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        myAddEvent(this.elements[i], sEv, fn);
    }
};

wscQuery.prototype.extend=function (name, fn)
{
    wscQuery.prototype[name]=fn;
};

function $(vArg)
{
    return new wscQuery(vArg);
}






