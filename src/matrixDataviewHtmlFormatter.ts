


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
                res += "<tr style='background-color:grey;color:white'>";
                res += "<th style='text-align: center;'></th>";
                for (let i = 0; i < levelNodes.length; i++) {
                    let node = levelNodes[i];
                    res += "<th style='text-align: center' colspan='" + node.leafCount + "' >";
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
               // res += root.level === 0 ? "<tr><th style='padding-top: 10px; border-top: 1.5px solid #E1EEF4;'></th><td style='padding-top: 10px; border-top: 1.5px solid #E1EEF4;' colspan='" + colCount  + "'></td></tr>" : "<tr>";
               if(root.level === 0){
               res += "<tr><th style='text-align:center;vertical-align: middle;border-top: 1px solid #E1EEF4;border-right: 1px solid #E1EEF4;'>";
               }
               else {
                res += "<tr><th style='text-align:center;vertical-align: middle;border-right: 1px solid #E1EEF4;'>";
               }
                for (let level = 0; level < root.level; level++) {
                    res += "&nbsp;&nbsp;"                    
                }

                let rootVal = root.level === 0 ? root.value : '';
                res += root.isSubtotal ? "Totals" : rootVal;
                res += "</th>";

                if (root.values) {
                    for (let i = 0; !(typeof root.values[i] === 'undefined' || root.values[i] === null || root.values[i] === 'null'); i++) {
                        let temp = root.values[i].value;
                        colCount++;
                        
                        res += "<td style='overflow:visible;white-space:nowrap;'>";
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
                                res += "<img src='data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIyMiIgd2lkdGg9IjIyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cG9seWdvbiBpZD0ic3ZnXzEiIGZpbGw9IkdyZWVuIiBzdHJva2U9IkdyZWVuIiBzdHJva2Utd2lkdGg9IjAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgcG9pbnRzPSIxMCwwIDEyLDkgMjAsOCAxMywxMyAxNiwyMCAxMCwxNSA0LDIwIDcsMTMgMCw5IDgsOSIvPgogPC9nPgo8L3N2Zz4=' align='center' alt='Green Star'></img>" 
                            }
                            else{
                                res += "<img src='data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIyMiIgd2lkdGg9IjIyIiB5PSItMSIgeD0iLTEiLz4KIDwvZz4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cG9seWdvbiBpZD0ic3ZnXzEiIGZpbGw9IkdyZWVuIiBzdHJva2U9IkdyZWVuIiBzdHJva2Utd2lkdGg9IjAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgcG9pbnRzPSIxMCwwIDIwLDEwLCAxMCwyMCAwLDEwIi8+CiA8L2c+Cjwvc3ZnPg==' align='center' alt='Green Dimond'></img>" 
                            }
                            
                            res +=  " " + temp  + "</td>";                        
                            
                        }
                        
                    }
                    res += "<td style='border: none;'><br/></td><td style='border: none;'><br/></td></tr>";
                }else
                {
                    
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;border-right: 1.5px solid #E1EEF4;'></td>"
                    res += "<td style='border-top: 1.5px solid #E1EEF4;'></td>"
                                       
                    res += "</tr>";
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