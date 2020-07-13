<script>
import { send } from "shared/actions.js";
</script>

<form>
    <input type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
</form>
<div class="nav">
    <button use:send="{"NEXT"}">Next</button>
</div>