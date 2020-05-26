


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */



module powerbi.extensibility.visual {
    
    export class MatrixDataviewHtmlFormatter {
        
        public static formatDataViewMatrix(matrix: powerbi.DataViewMatrix): string {
            let htmlString = "<div class='datagrid'><table style='border-collapse: collapse;'>";            
            let levelToColumnNodesMap: any[][] = [];
            MatrixDataviewHtmlFormatter.countColumnNodeLeaves(matrix.columns.root, levelToColumnNodesMap);
            htmlString += MatrixDataviewHtmlFormatter.formatColumnNodes(matrix.columns.root, levelToColumnNodesMap);
            htmlString += MatrixDataviewHtmlFormatter.formatRowNodes(matrix.rows.root);
            return htmlString += "</table></div>";


        }

        private static countColumnNodeLeaves(root, levelToColumnNodesMap: any[][]): number {
            if (!(typeof root.level === 'undefined' || root.level === null)) {
                if (!levelToColumnNodesMap[root.level]) {
                    levelToColumnNodesMap[root.level] = [root];
                } else {
                    levelToColumnNodesMap[root.level].push(root);
                }
            }
            let leafCount;
            if (root.isSubtotal || !root.children) {
                return leafCount = 1;
            } else {
                leafCount = 0;
                for (let child of root.children) {
                    leafCount += MatrixDataviewHtmlFormatter.countColumnNodeLeaves(child, levelToColumnNodesMap);
                }
            }
            return root.leafCount = leafCount;
        }

        private static formatColumnNodes(root, levelToColumnNodesMap: any[][]): string {
            let res = "";
            for (let level = 0; level < levelToColumnNodesMap.length; level++) {
                let levelNodes = levelToColumnNodesMap[level];
                res += "<tr class='columnheader'>";
                res += "<th style='text-align: center;'></th>";
                for (let i = 0; i < levelNodes.length; i++) {
                    let node = levelNodes[i];
                    if(level == 0)
                    {
                    res += "<th style='font-weight:normal;background-color:#4473c4;color:white;text-align: center;border-right: 2px solid #E1EEF4;' colspan='" + node.leafCount + "' >";
                    }
                    else{
                        res += "<th style='font-weight:normal;background-color:#dae3f3;color:black;text-align: center;border-right: 2px solid #E1EEF4;' colspan='" + node.leafCount + "' >";
                    }
                    res += node.isSubtotal ? "Totals" : node.value;
                    res += "</th>";
                }
                res += "</tr>";
            }
            return res;
        }

        
        private static formatRowNodes(root): string {
            let res = "";
            let colCount = 14;
            
            if (!(typeof root.level === 'undefined' || root.level === null)) {
              
               res += "<tr class='rotate-table-grid'>";
               if(root.level === 0){
               res += "<th style='background-color:#4473c4;color:white;text-align: center;vertical-align: middle;border-top: 2px solid #E1EEF4;border-right: 1px solid #E1EEF4;' rowspan='" + (root.children.length+1) + "' ><div><span>";
               let rootVal = root.level === 0 ? root.value : '';
                res += root.isSubtotal ? "Totals" : rootVal;
               res += "</span></div></th></tr>";
               }

               

                if (root.values) {
                    for (let i = 0; !(typeof root.values[i] === 'undefined' || root.values[i] === null || root.values[i] === 'null'); i++) {
                        let temp = root.values[i].value;
                        colCount++;
                        
                        res += "<td>";
                        if(temp === null)
                        {   
                            temp = ' ';                            
                            res +=  temp  + "</td>";                        
                        }
                        else{

                            let str1 = temp.substring(0, temp.indexOf(' '));
                            let str2 = str1.substring(str1.indexOf('.')+1);
                            
                            if(str2.length > 0)
                            {  
                                let str3 = temp.indexOf(' days)');
                               
                                if(str3 != -1)
                                {
                                    res += "<img src='data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8IS0tIENyZWF0ZWQgd2l0aCBNZXRob2QgRHJhdyAtIGh0dHA6Ly9naXRodWIuY29tL2R1b3BpeGVsL01ldGhvZC1EcmF3LyAtLT4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgeD0iLTEiIHk9Ii0xIiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgZmlsbD0ibm9uZSIvPgogIDxnIGlkPSJjYW52YXNHcmlkIiBkaXNwbGF5PSJub25lIj4KICAgPHJlY3QgaWQ9InN2Z18yIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4PSIwIiB5PSIwIiBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxlbGxpcHNlIGZpbGw9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMCIgY3g9IjExLjUiIGN5PSIxMS41IiBpZD0ic3ZnXzEiIHJ4PSIxMS41IiByeT0iMTEuNSIgc3Ryb2tlPSIjMDAwIi8+CiAgPGVsbGlwc2UgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIiBjeD0iMTEuNSIgY3k9IjExLjUiIGlkPSJzdmdfNCIgcng9IjYiIHJ5PSI2IiBzdHJva2U9IiMwMDAiLz4KIDwvZz4KPC9zdmc+' align='center' alt='Red Circle'></img>" 
                                 
                                }
                                else
                                {
                                    res += "<img src='data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8IS0tIENyZWF0ZWQgd2l0aCBNZXRob2QgRHJhdyAtIGh0dHA6Ly9naXRodWIuY29tL2R1b3BpeGVsL01ldGhvZC1EcmF3LyAtLT4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgeD0iLTEiIHk9Ii0xIiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgZmlsbD0ibm9uZSIvPgogIDxnIGlkPSJjYW52YXNHcmlkIiBkaXNwbGF5PSJub25lIj4KICAgPHJlY3QgaWQ9InN2Z18yIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4PSIwIiB5PSIwIiBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxlbGxpcHNlIGZpbGw9IiMwMGNjMDAiIHN0cm9rZS13aWR0aD0iMCIgY3g9IjExLjUiIGN5PSIxMS41IiBpZD0ic3ZnXzEiIHJ4PSIxMS41IiByeT0iMTEuNSIgc3Ryb2tlPSIjMDAwIi8+CiAgPGVsbGlwc2UgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIiBjeD0iMTEuNSIgY3k9IjExLjUiIGlkPSJzdmdfNCIgcng9IjYiIHJ5PSI2IiBzdHJva2U9IiMwMDAiLz4KIDwvZz4KPC9zdmc+' align='center' alt='Green Circle'></img>" 
                                }

                            }
                            else{
                                let str3 = temp.indexOf(' days))');
                               
                                if(str3 != -1)
                                {
                                    res += "<img src='data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8IS0tIENyZWF0ZWQgd2l0aCBNZXRob2QgRHJhdyAtIGh0dHA6Ly9naXRodWIuY29tL2R1b3BpeGVsL01ldGhvZC1EcmF3LyAtLT4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgeD0iLTEiIHk9Ii0xIiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgZmlsbD0ibm9uZSIvPgogIDxnIGlkPSJjYW52YXNHcmlkIiBkaXNwbGF5PSJub25lIj4KICAgPHJlY3QgaWQ9InN2Z18yIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4PSIwIiB5PSIwIiBzdHJva2Utd2lkdGg9IjAiIGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxlbGxpcHNlIGZpbGw9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMCIgY3g9IjExLjUiIGN5PSIxMS41IiBpZD0ic3ZnXzEiIHJ4PSIxMS41IiByeT0iMTEuNSIgc3Ryb2tlPSIjMDAwIi8+CiA8L2c+Cjwvc3ZnPg==' align='center' alt='Red Circle'></img>" 
                                }
                                else
                                {
                                    res += "<img src='data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8IS0tIENyZWF0ZWQgd2l0aCBNZXRob2QgRHJhdyAtIGh0dHA6Ly9naXRodWIuY29tL2R1b3BpeGVsL01ldGhvZC1EcmF3LyAtLT4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9IjI1IiB3aWR0aD0iMjUiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIGlkPSJjYW52YXNHcmlkIj4KICAgPHJlY3QgZmlsbD0idXJsKCNncmlkcGF0dGVybikiIHN0cm9rZS13aWR0aD0iMCIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9InN2Z18yIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxlbGxpcHNlIHN0cm9rZT0iIzAwMCIgcnk9IjExLjUiIHJ4PSIxMS41IiBpZD0ic3ZnXzEiIGN5PSIxMS41IiBjeD0iMTEuNSIgc3Ryb2tlLXdpZHRoPSIwIiBmaWxsPSIjMDBjYzAwIi8+CiA8L2c+Cjwvc3ZnPg==' align='center' alt='Red Circle'></img>" 
                                }
                            }
                            
                            res +=  " " + temp  + "</td>";                        
                            
                        }
                        
                    }
                    res += "<td style='border-style: none;'></td><td style='border-style: none;'></td></tr>";
                }

                
            }
            if (root.children) {
                for (let child of root.children) {
                    res += MatrixDataviewHtmlFormatter.formatRowNodes(child);
                }
            }
            return res;
        }
    }
}