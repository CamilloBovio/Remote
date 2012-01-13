
/**
* ...
* @author bigspaceship.com
* ...
*/


class com.bigspaceship.Delegate extends Object{
	static function create(obj:Object, func:Function):Function
	{
		var f = function()
		{
			var target = arguments.callee.target;
			var func   = arguments.callee.func;
			var args   = arguments.callee.args;
			
			return func.apply(target, args.concat(arguments));
		};

		f.target = arguments.shift();
		f.func   = arguments.shift();
		f.args   = arguments;
		
		return f;
	}

	function Delegate(f:Function)
	{
		func = f;
	}

	private var func:Function;

	function createDelegate(obj:Object):Function
	{
		return create(obj, func);
	}
}
