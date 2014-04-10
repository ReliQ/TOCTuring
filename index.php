<?php	
/**
 *	TOCTuring
 *	A Theory of Computation Assignment
 *
 * 	@author Patrick Reid
 * 	@link http://www.reliqartz.com
 */
?>

<!doctype html>
<html lang="en-gb">
<head>
	<title>TOCTuring | Turing Machine demonstration</title>
	<meta http-equiv="X-UA-Compatible" content="IE=9" />
	<meta charset="utf-8" /> 
	<link rel="stylesheet" href="./css/style.css" />
</head>
<body>
	<div id = "wrapper">
		<aside class="clr"></aside>
		<section id="control">
			<header>
				<h1>TOCTuring</h1>
			</header>

			<section id="in">
				<div id="intro">
					<aside>L = {a,c,e,r}</aside>
				</div>
				<form action="javascript:void(0)" method="post">
					<div>
						<label for="input">Input:</label>
						<input type="text" name="input" maxlength="15" placeholder="TAPE" />
						<label for="lag">Lag:</label>
						<input type="number" name="lag" maxlength="5" min="0" style="width: 50px;" value="90" />
					</div>
					<div class="radio">
						<label for="do">Check for:</label>
						<input type="radio" name="do" value="anag" ><span>Anagram</span></input>
						<input type="radio" name="do" value="pali" checked><span>Palindrome</span></input>
						<br/>
						<span style="float:right;">
							<input type="checkbox" name="trace" value="trace" checked><span>Show trace</span></input>
						</span>
					</div>
					<div>
						
						<input type="submit" value="Simulate" onclick="javascript:simulate()" />
						<button value="Reset" onclick="javascript:location.reload()">Reset</button>
					</div>
				</form>
				<p id="display">
					<span></span>
				</p>
				<p id="conclusion">	
				</p>
			</section>

			<footer>
				<span>TOCTuring v1.0 &copy; <?php echo date('Y'); ?></span>
			</footer>
		</section>

		<section id="screen">
			<h2>Trace:</h2>
			<p id="slog"></p>
		</section>
		<aside class="clr"></aside>
	</div>
	<script type="text/javascript" src="./js/jquery-2.1.0.min.js"></script>
	<script type="text/javascript" src="./js/jquery.scrollTo.min.js"></script>
	<script type="text/javascript" src="./js/turing.js"></script>
</body>
</html>