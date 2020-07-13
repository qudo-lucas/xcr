<script>
import { send } from "shared/actions.js";
</script>

<form>
    <input type="text" placeholder="First Name" />
    <input type="text" placeholder="Last Name" />
    <input type="text" placeholder="Email" />
    <input type="text" placeholder="Phone" />
</form>
<div class="nav">
    <button use:send={"BACK"}>Back</button>
    <button use:send={"HOME"}>Finish</button>
</div>