import * as fs from 'fs';
import * as path from 'path';
import { docFolderPath } from './common';

/**
 * 搜索符合条件的文件
 * @param keyword 
 */
export function searchFiles(keyword: string): string[] {
	const _files = fs.readdirSync(docFolderPath);
	const _fileList = _files?.filter(_filename => {
		const _docFilePath = path.join(docFolderPath, _filename);
		const _docContent = fs.readFileSync(_docFilePath, 'utf-8');
		return _docContent.indexOf(keyword) !== -1;
	});
	return _fileList;
}