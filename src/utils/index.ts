import qs from 'qs'

const handlePointParams = (dataPoint = '') => {
	let re:Record<string, any> = {}; let it;
	let dataPointArr = dataPoint.split('&');
	
	if (!dataPointArr.length) {
			return false;
	}
	while (dataPointArr.length) {
			let he = dataPointArr.pop() || '';
			it = he.split('=');
			re[it[0]] = it[1];
	}
	// 必须含有point和_fm信息
	if (!re['point']) {
			return false;
	}
	return {
			point: re['point'],
			fm: re['_fm']
	};
};

export function clickPoint(params: string | number) {
	if (typeof params === 'number') {
			params = `point=${params}&_fm=`;
	}

	let pointObj = handlePointParams(String(params));
	if (!pointObj) {
			return;
	}
 
	const img = document.createElement('img');
	let keyMap = {
			app_type: 'url_tj',
			log_type: 'click',
			rad: Math.random(),
			taobaoNick: localStorage.getItem('id') || '',
	};

	let queryStr = qs.stringify({ ...keyMap, ...pointObj });
	img.src = `//ftj.superboss.cc/tj.jpg?${queryStr}`;
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 处理图片URL，确保图片可以正确加载
 * @param url 图片URL
 * @returns 处理后的图片URL
 */
export const getImageUrl = (url: string): string => {
  if (!url) return '';
  
  // 如果是完整的HTTP/HTTPS URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是相对路径，确保以 / 开头
  if (!url.startsWith('/')) {
    return `/${url}`;
  }
  
  return url;
};
