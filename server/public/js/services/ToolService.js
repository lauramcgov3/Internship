angular.module('ToolService', []).factory('Tool', function() {
       
    return {
        
        tool : {
            category: 'annotation',
            action: 'selection'
        },
        setTool: function(category, action) {
	       this.tool.category = category,
	       this.tool.action = action
        },
        
        getTool: function() {
            return this.tool;
        }
    }
});