"use strict";var __importDefault=this&&this.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(exports,"__esModule",{value:!0});const detect_indent_1=__importDefault(require("detect-indent")),pug_1=__importDefault(require("pug")),GET_MIXINS=a=>`mixin if(condition)
%_| {#if !{condition}}
%_block
%_| {/if}

mixin else
%_| {:else}
%_block

mixin elseif(condition)
%_| {:else if !{condition}}
%_block

mixin each(loop)
%_| {#each !{loop}}
%_block
%_| {/each}

mixin await(promise)
%_| {#await !{promise}}
%_block
%_| {/await}

mixin then(answer)
%_| {:then !{answer}}
%_block

mixin catch(error)
%_| {:catch !{error}}
%_block

mixin debug(variables)
%_| {@debug !{variables}}`.replace(/%_/g,"tab"===a?"\t":"  "),transformer=async({content:a,filename:b,options:c})=>{var d;c={doctype:"html",filename:b,...c};const{type:e}=detect_indent_1.default(a),f=`${GET_MIXINS(e)}\n${a}`,g=pug_1.default.compile(f,{compileDebug:!1,filename:b,...c});return{code:g(),dependencies:null!==(d=g.dependencies)&&void 0!==d?d:null}};exports.default=transformer;