"use strict";



const walk:Function = (node:any, callback:any) =>
{
	if (callback(node) === false)
	{
		return false;
	}
	else
	{
		let childNode,i: any;

		if (node.childNodes !== undefined)
		{
			i = 0;
			childNode = node.childNodes[i];
		}

		while (childNode !== undefined)
		{
			if (walk(childNode, callback) === false)
			{
				return false;
			}
			else
			{
				childNode = node.childNodes[++i];
			}
		}
	}
};

export default walk;